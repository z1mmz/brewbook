import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Button,
  Card,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import useBeans from "../../hooks/useBeans";
import beansService from "../../services/beans";
import LoginContext from "../../contexts/loginContext";

const emptyForm = () => ({ name: "", roaster: "", process: "", variety: "", tastingNotes: "" });

function BeanForm({ initial, onSubmit, onCancel, isLoading, submitLabel }) {
  const [form, setForm] = useState(initial ?? emptyForm());
  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, roaster, process, variety, tastingNotes } = form;
    const payload = { name: name.trim(), roaster: roaster.trim() };
    if (process.trim()) payload.process = process.trim();
    if (variety.trim()) payload.variety = variety.trim();
    if (tastingNotes.trim()) payload.tastingNotes = tastingNotes.trim();
    onSubmit(payload);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack gap={3} align="stretch">
        <HStack gap={3}>
          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium">Name *</Text>
            <Input value={form.name} onChange={set("name")} placeholder="e.g. Yirgacheffe Natural" required />
          </Box>
          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium">Roaster *</Text>
            <Input value={form.roaster} onChange={set("roaster")} placeholder="e.g. Square Mile" required />
          </Box>
        </HStack>
        <HStack gap={3}>
          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium">Process</Text>
            <Input value={form.process} onChange={set("process")} placeholder="e.g. washed, natural, honey" />
          </Box>
          <Box flex={1}>
            <Text fontSize="sm" mb={1} fontWeight="medium">Variety</Text>
            <Input value={form.variety} onChange={set("variety")} placeholder="e.g. Gesha, Bourbon" />
          </Box>
        </HStack>
        <Box>
          <Text fontSize="sm" mb={1} fontWeight="medium">Tasting Notes</Text>
          <Textarea
            value={form.tastingNotes}
            onChange={set("tastingNotes")}
            placeholder="e.g. blueberry, jasmine, dark chocolate"
            rows={2}
          />
        </Box>
        <HStack justify="flex-end" gap={2}>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel} type="button">
              Cancel
            </Button>
          )}
          <Button type="submit" colorPalette="orange" size="sm" loading={isLoading}>
            {submitLabel}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}

function SimilarRecipes({ beanId }) {
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    try {
      const data = await beansService.getSimilarRecipes(beanId);
      setRecipes(data);
    } catch {
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  if (recipes === null) {
    return (
      <Button size="xs" variant="outline" onClick={load} loading={loading} mt={2}>
        Find matching recipes
      </Button>
    );
  }

  return (
    <Box mt={3}>
      <Text fontSize="sm" fontWeight="semibold" mb={2}>
        Well-reviewed recipes with similar beans
      </Text>
      {recipes.length === 0 ? (
        <Text fontSize="sm" opacity={0.6}>No well-reviewed recipes found for this process yet.</Text>
      ) : (
        <VStack gap={2} align="stretch">
          {recipes.map((r) => (
            <Box
              key={r._id}
              borderWidth="1px"
              borderRadius="md"
              p={2}
              cursor="pointer"
              _hover={{ bg: "gray.50", _dark: { bg: "gray.800" } }}
              onClick={() => navigate(`/recipes/${r._id}`)}
            >
              <Text fontSize="sm" fontWeight="medium">{r.title}</Text>
              <Text fontSize="xs" opacity={0.6}>
                by {r.user?.username ?? "Unknown"} · ★ {r.avgRating?.toFixed(1)}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}

function BeanCard({ bean, onDelete, isDeleting }) {
  const [editing, setEditing] = useState(false);
  const { updateBean, isUpdating } = useBeans();

  const handleUpdate = (payload) => {
    updateBean(bean.id, payload);
    setEditing(false);
  };

  return (
    <Card.Root>
      <Card.Body>
        {editing ? (
          <BeanForm
            initial={{ name: bean.name, roaster: bean.roaster, process: bean.process ?? "", variety: bean.variety ?? "", tastingNotes: bean.tastingNotes ?? "" }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
            isLoading={isUpdating}
            submitLabel="Save changes"
          />
        ) : (
          <VStack align="start" gap={1}>
            <Text fontWeight="bold">{bean.name}</Text>
            <Text fontSize="sm" opacity={0.7}>{bean.roaster}</Text>
            {bean.process && <Text fontSize="sm">Process: {bean.process}</Text>}
            {bean.variety && <Text fontSize="sm">Variety: {bean.variety}</Text>}
            {bean.tastingNotes && (
              <Text fontSize="sm" opacity={0.8} mt={1}>{bean.tastingNotes}</Text>
            )}
            <SimilarRecipes beanId={bean.id} />
          </VStack>
        )}
      </Card.Body>
      {!editing && (
        <Card.Footer justifyContent="flex-end">
          <HStack gap={2}>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              loading={isDeleting}
              onClick={() => {
                if (window.confirm("Delete this bean?")) onDelete(bean.id);
              }}
            >
              Delete
            </Button>
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
}

export default function MyBeans() {
  const { loggedInUser } = useContext(LoginContext);
  const navigate = useNavigate();
  const { beans, isLoading, createBean, deleteBean, isCreating } = useBeans();
  const [showAddForm, setShowAddForm] = useState(false);

  if (!loggedInUser) {
    return (
      <VStack gap={4} align="center" mt={8}>
        <Heading>My Beans</Heading>
        <Text>Please log in to manage your beans.</Text>
        <Button onClick={() => navigate("/login")} colorPalette="orange">Log In</Button>
      </VStack>
    );
  }

  const handleCreate = (payload) => {
    createBean(payload);
    setShowAddForm(false);
  };

  return (
    <VStack gap={6} align="stretch">
      <HStack justify="space-between" mt={4}>
        <Heading>My Beans</Heading>
        {!showAddForm && (
          <Button colorPalette="orange" size="sm" onClick={() => setShowAddForm(true)}>
            Add Bean
          </Button>
        )}
      </HStack>

      {showAddForm && (
        <Box borderWidth="1px" borderRadius="xl" p={5}>
          <Heading size="sm" mb={4}>Add a new bean</Heading>
          <BeanForm
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            isLoading={isCreating}
            submitLabel="Add bean"
          />
        </Box>
      )}

      {isLoading ? (
        <Text opacity={0.5}>Loading your beans…</Text>
      ) : beans.length === 0 ? (
        <Text opacity={0.5} mt={4}>
          You haven't added any beans yet. Click "Add Bean" to get started.
        </Text>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
          gap={5}
        >
          {beans.map((bean) => (
            <BeanCard
              key={bean.id}
              bean={bean}
              onDelete={deleteBean}
            />
          ))}
        </Grid>
      )}
    </VStack>
  );
}
